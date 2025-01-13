import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc)
dayjs.extend(timezone)


/**
 * 格式化时间
 * 
 * @param {number} time 时间戳，单位 s 或 ms
 * @param {string} [timezone] 时区
 * @returns {string} 格式化后的时间
 */
export function formatTime(time, timezone) {
  const _time = timezone ? dayjs(time).tz(timezone) : dayjs(time);
  return _time.format('HH:mm');
}