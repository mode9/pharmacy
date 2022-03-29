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
  calcDatetime (time: string): Spacetime {
    const now: Spacetime = spacetime.now(TIMEZONE);
    let hours: number = parseInt(time.split(':')[0]);
    let newTime;
    if (hours > 23) {
      newTime = now.add(1, 'date');
      hours = hours - 24;
      let closingTime = hours + ':' + time.split(':')[1];
      newTime = newTime.time(closingTime);
    } else {
      newTime = now.time(time);
    }
    return newTime;
  }

  getOpening(): Spacetime|null {
    return this.opening ? spacetime.now(TIMEZONE).time(this.opening) : null;
  }
  getClosing(): Spacetime|null {
   return this.closing ? this.calcDatetime(this.closing) : null;
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
    return `${this.opening} ~ ${this.closing}`;
  }
  isOpen(): boolean {
    if (!this.opening || !this.closing) return false;
    const now: Spacetime = spacetime.now(TIMEZONE);
    const opening: Spacetime = now.time(this.opening);
    const closing: Spacetime = this.calcDatetime(this.closing);
    return now.isBetween(opening, closing);
  }
}

export default OpeningHours;
export { TIMEZONE, stringToTimeObject };