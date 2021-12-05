import spacetime from 'spacetime';
import { Spacetime } from 'spacetime/types/types';
import type { OpeningHoursType } from './types';

const TIMEZONE = process.env.TZ;


function stringToTimeObject(val: string): OpeningHoursType {
  const arrTime = val.split('~');
  return {opening: arrTime[0], closing: arrTime[1]};
}


class OpeningHours {
  opening: string;
  closing: string;

  constructor (data: OpeningHoursType) {
    this.opening = data.opening;
    this.closing = data.closing;
  }

  getOpening(): Spacetime {
    return spacetime.now(TIMEZONE).time(this.opening);
  }
  getClosing(): Spacetime {
   return spacetime.now(TIMEZONE).time(this.closing); 
  }
  isOpen(): boolean {
    if (!this.opening || !this.closing) return false;
    const now: Spacetime = spacetime.now(TIMEZONE);
    const opening: Spacetime = now.time(this.opening);
    let closingHours: number = parseInt(this.closing.split(':')[0]);
    let closing;
    if (closingHours > 23) {
      closing = now.add(1, 'date');
      closingHours = closingHours - 24;
      let closingTime = closingHours + ':' + this.closing.split(':')[1];
      closing = closing.time(closingTime);
    } else {
      closing = now.time(this.closing);
    }
    return now.isBetween(opening, closing);
  }
}

export default OpeningHours;
export { TIMEZONE, stringToTimeObject };