export class CreateSerumBankDto {
  constructor(serumBankCode: string, capacity: number) {
    this.serumBankCode = serumBankCode;
    this.capacity = capacity;
  }

  serumBankCode: string;

  capacity: number;
}

// @ManyToOne(() => User, (user) => user.id)
//   @JoinColumn({ name: 'user_id' })
//   userId: User;

//   @Column({ name: 'serum_bank_code' })
//   serumBankCode: string;

//   @Column({ name: 'capacity', default: 100 })
//   capacity: number;

//   @Column({ name: 'used_positions', default: 0 })
//   usedPositions: number;
