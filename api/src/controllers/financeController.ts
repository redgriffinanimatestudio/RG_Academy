import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const financeController = {
  // --- TREASURY & ESCROW STATS ---
  async getStats(req: AuthRequest, res: Response) {
    try {
      const [
        escrowTotal,
        totalRevenue,
        pendingPayouts
      ] = await Promise.all([
        (prisma as any).escrow.aggregate({ _sum: { amount: true } }),
        prisma.transaction.aggregate({ where: { type: 'payment', status: 'completed' }, _sum: { amount: true } }),
        prisma.contract.count({ where: { status: 'pending' } })
      ]);

      const recentTransactions = await prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { displayName: true, email: true } } }
      });

      return success(res, {
        summary: {
          escrow: escrowTotal._sum.amount || 0,
          revenue: totalRevenue._sum.amount || 0,
          pendingPayouts
        },
        recentTransactions
      });
    } catch (e) {
      return error(res, 'Failed to fetch financial stats');
    }
  },

  // --- ESCROW & PAYOUT WORKFLOWS ---
  async getEscrows(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query;
      const escrows = await (prisma as any).escrow.findMany({
        where: status ? { status: status as string } : {},
        include: { 
          contract: { 
            include: { 
              project: true,
              client: { select: { displayName: true } },
              executor: { select: { displayName: true } }
            } 
          } 
        },
        orderBy: { updatedAt: 'desc' }
      });
      return success(res, escrows);
    } catch (e) {
      return error(res, 'Failed to fetch escrow list');
    }
  },

  async releasePayment(req: AuthRequest, res: Response) {
    try {
      const { escrowId } = req.params;
      
      const escrow = await (prisma as any).escrow.findUnique({
        where: { id: escrowId },
        include: { contract: true }
      });

      if (!escrow || escrow.status !== 'locked') {
        return error(res, 'Invalid or already released escrow');
      }

      const platformFee = escrow.amount * 0.05; // 5% fee
      const payoutAmount = escrow.amount - platformFee;

      // 1. Release Escrow
      await (prisma as any).escrow.update({
        where: { id: escrowId },
        data: { status: 'released' }
      });

      // 2. Transfer to Executor
      await prisma.user.update({
        where: { id: escrow.contract.executorId! },
        data: { balance: { increment: payoutAmount } }
      });

      // 3. Create Transaction Audit log
      await prisma.transaction.create({
        data: {
          userId: escrow.contract.executorId!,
          amount: payoutAmount,
          type: 'service_payout',
          status: 'completed',
          metadata: JSON.stringify({
            contractId: escrow.contractId,
            originalAmount: escrow.amount,
            fee: platformFee
          })
        }
      });

      // 4. Update Contract
      await prisma.contract.update({
        where: { id: escrow.contractId },
        data: { status: 'completed' }
      });

      return success(res, { released: true, amount: payoutAmount });
    } catch (e) {
      return error(res, 'Failed to release escrow payment');
    }
  },

  /**
   * Get current user's balance and mission-critical ledger
   */
  async getMyBalance(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const [user, transactions, myEscrows] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { balance: true } }),
        prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 }),
        (prisma as any).escrow.findMany({ 
          where: { 
            contract: { executorId: userId },
            status: 'locked'
          },
          _sum: { amount: true }
        })
      ]);
      
      const escrowTotal = myEscrows.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
      const lifetimeEarning = transactions
        .filter(t => t.type.includes('payout') || t.type === 'service_payment')
        .reduce((acc, t) => acc + t.amount, 0);

      return success(res, { 
        available: user?.balance || 0,
        inEscrow: escrowTotal,
        lifetime: lifetimeEarning,
        transactions
      });
    } catch (e) {
      return error(res, 'Failed to fetch industrial balance');
    }
  },

  async requestWithdrawal(req: AuthRequest, res: Response) {
    try {
      const { amount, method } = req.body;
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.balance < amount) {
        return error(res, 'Insufficient funds for withdrawal');
      }

      // Record withdrawal transaction
      await prisma.transaction.create({
        data: {
          userId,
          amount: -amount,
          type: 'withdrawal',
          status: 'pending',
          metadata: JSON.stringify({ method })
        }
      });

      // Deduct balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });

      return success(res, { success: true, message: 'Withdrawal requested' });
    } catch (e) {
      return error(res, 'Withdrawal failed');
    }
  }
};
