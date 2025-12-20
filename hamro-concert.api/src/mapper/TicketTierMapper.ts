import { TicketTier } from "../model/TicketTier";
import { TicketTierVM } from "../viewmodel/TicketTierVM";

export class TicketTierMapper {
  static toVM(model: TicketTier): TicketTierVM {
    return {
      id: model.id,
      concertId: model.concertId,
      ticketTypeId: model.ticketTypeId,
      price: model.price,
      total: model.total,
      available: model.available,
    };
  }

  static toModel(vm: TicketTierVM): TicketTier {
    return {
      id: vm.id,
      concertId: vm.concertId,
      ticketTypeId: vm.ticketTypeId,
      price: vm.price,
      total: vm.total,
      available: vm.available,
    };
  }

  static toVMList(list: TicketTier[]): TicketTierVM[] {
    return list.map((i) => this.toVM(i));
  }

  static toModelList(list: TicketTierVM[]): TicketTier[] {
    return list.map((i) => this.toModel(i));
  }
}
