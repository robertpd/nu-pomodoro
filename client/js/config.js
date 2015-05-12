const {protocol, host} = window.location;

export default {
  socketUrl: `${protocol}//${host}`
};