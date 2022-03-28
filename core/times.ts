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

  getOpening(): Spacetime|null {
    return this.opening ? spacetime.now(TIMEZONE).time(this.opening) : null;
  }
  getClosing(): Spacetime|null {
   return this.closing ? spacetime.now(TIMEZONE).time(this.closing) : null;
  }
  humanizeWorkingHours(): string {
    const opening = this.getOpening();
    const closing = this.getClosing();
    if (!opening && !closing) return "영업안함"
    const humanizedOpening = opening?.format('{hour-24-pad}:{minute-pad}') || "알수없음";
    const humanizedClosing = closing?.format('{hour-24-pad}:{minute-pad}') || "알수없음";
    if (humanizedOpening === '00:00' && humanizedClosing === '00:00') {
      return '24시간 영업';
    }
    return `${humanizedOpening} ~ ${humanizedClosing}`;
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