import moment from 'moment';

const pad = t => t < 10 ? `0${t}` : `${t}`;

export const formatTime = t => {
  const m = moment.duration(t);
  return `${pad(m.minutes())}:${pad(m.seconds())}`;
};