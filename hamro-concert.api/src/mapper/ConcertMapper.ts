import { Concert } from "../model/Concert";
import { ConcertVM } from "../viewmodel/ConcertVM";

export class ConcertMapper {

  static toVM(concert: Concert): ConcertVM {
    return {
      id: concert.id,
      title: concert.title,
      artist: concert.artist,
      date: concert.date,
      time: concert.time,
      venue: concert.venue,
      city: concert.city,
      image: concert.image,
      description: concert.description,
    };
  }

  static toModel(concertVM: ConcertVM): Concert {
    return {
      id: concertVM.id,
      title: concertVM.title,
      artist: concertVM.artist,
      date: concertVM.date,
      time: concertVM.time,
      venue: concertVM.venue,
      city: concertVM.city,
      image: concertVM.image,
      description: concertVM.description,
    };
  }

  static toVMList(concerts: Concert[]): ConcertVM[] {
    return concerts.map(c => this.toVM(c));
  }

  static toModelList(concertVMs: ConcertVM[]): Concert[] {
    return concertVMs.map(c => this.toModel(c));
  }
}
