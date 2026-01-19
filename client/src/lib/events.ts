type EventCallback = (data: any) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(data));
  }
}

export const apiEvents = new EventEmitter();

export const toastEvents = {
  show: (message: string, variant: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    apiEvents.emit('toast', { message, variant });
  }
};
