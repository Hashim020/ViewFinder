import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const handleEvent = (eventName, eventData) => {
    eventEmitter.emit(eventName, eventData);
};

export { eventEmitter, handleEvent };
