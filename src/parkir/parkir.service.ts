import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindParkirDto } from './dto/find-parkir.dto';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  // Hitung total 
  private hitungTotal(jenisKendaraan: string, durasi: number) {
    const tarif = {
      RODA2: { first: 3000, perHour: 2000 },
      RODA4: { first: 6000, perHour: 4000 },
    };

    const t = tarif[jenisKendaraan];
    if (!t) throw new Error('Jenis kendaraan tidak valid');

    if (durasi <= 1) return t.first;

    return t.first + (durasi - 1) * t.perHour;
  }

  // CREATE
  async create(dto: CreateParkirDto) {
    try {
      const { platNomor, jenisKendaraan, durasi } = dto;
      const total = this.hitungTotal(jenisKendaraan, durasi);

      const created = await this.prisma.parkir.create({
        data: { platNomor, jenisKendaraan, durasi, total },
      });

      return {
        success: true,
        message: 'Data parkir berhasil dibuat',
        data: created,
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal membuat data parkir : ${error.message}`,
        data: null,
      };
    }
  }

  // GET ALL
  async findAll(findParkirDto: FindParkirDto) {
    try {
      const { search = '', jenisKendaraan, page = 1, limit = 10, startDate, endDate } = findParkirDto;
      const skip = (page - 1) * limit;
      const where: any = {};

      // Search platNomor
      if (search) {
        where.platNomor = { contains: search };
      }

      // Filter jenis kendaraan
      if (jenisKendaraan) {
        where.jenisKendaraan = jenisKendaraan;
      }

      // Filter tanggal
      if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
      where.createdAt.gte = start;
    }
  }
  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }
}

      // Ambil data parkir
      const parkir = await this.prisma.parkir.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      });

      const total = await this.prisma.parkir.count({ where });

      return {
        success: true,
        message: 'Parkir data found successfully',
        data: parkir,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error when getting parkir data: ${error.message}`,
        data: null,
      };
    }
  }

  // GET BY ID
  async findOne(id: number) {
    try {
      const parkir = await this.prisma.parkir.findUnique({ where: { id } });

      if (!parkir) {
        throw new NotFoundException('Data parkir tidak ditemukan');
      }

      return {
        success: true,
        message: 'Data parkir ditemukan',
        data: parkir,
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mengambil data parkir : ${error.message}`,
        data: null,
      };
    }
  }

  // UPDATE
  async update(id: number, dto: UpdateParkirDto) {
    try {
      const existing = await this.prisma.parkir.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Data parkir tidak ditemukan');

      const durasiBaru = dto.durasi ?? existing.durasi;
      const totalBaru = this.hitungTotal(existing.jenisKendaraan, durasiBaru);

      const updated = await this.prisma.parkir.update({
        where: { id },
        data: { durasi: durasiBaru, total: totalBaru },
      });

      return {
        success: true,
        message: 'Data parkir berhasil diperbarui',
        data: updated,
      };
    } catch (error) {
      return {
        success: false,
        message: `Terjadi kesalahan: ${error.message}`,
        data: null,
      };
    }
  }

  // DELETE
  async remove(id: number) {
    try {
      await this.prisma.parkir.delete({ where: { id } });

      return {
        success: true,
        message: 'Data parkir berhasil dihapus',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: `Terjadi kesalahan: ${error.message}`,
        data: null,
      };
    }
  }

  // TOTAL PENDAPATAN
  async total() {
    try {
      const semuaParkir = await this.prisma.parkir.findMany();
      const totalPendapatan = semuaParkir.reduce((sum, parkir) => sum + parkir.total, 0);

      return {
        success: true,
        message: 'Total pendapatan berhasil dihitung',
        data: { totalPendapatan },
      };
    } catch (error) {
      return {
        success: false,
        message: `Terjadi kesalahan: ${error.message}`,
        data: null,
      };
    }
  }
}
