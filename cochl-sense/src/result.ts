/*tslint:disable variable-name*/

/**
 * Event contains data for one given event :
 * it contains what happen, when, and at which probability
 */
export class Event {
    /** end timestamp of the detected event since the begining of the inference */
    public end_time: number;
    /** probablity for the event to happen. Its values is between 0 and 1 */
    public probability: number;
    /** start timestamp of the detected event since the begining of the inference */
    public start_time: number;
    /** name of the detected event */
    public tag: string;

    public constructor(tag: string, start_time: number, end_time: number, probability: number) {
        this.tag = tag;
        this.start_time = start_time;
        this.end_time = end_time;
        this.probability = probability;
    }
}

/**
 * Result is an object which contains data of the
 */
export class Result {
    private events: Event[];
    private filter: (ev: Event) => boolean;
    private readonly svc: string;

    public constructor(cochlSense: any) {
        this.svc = cochlSense.getService();
        this.events = grpcToInternalEvent(cochlSense);
        this.filter = (_: Event): boolean => true;
    }

    public allEvents(): Event[] {
        return this.events;
    }

    public appendNewResult(response: any, maxStoredEvents: number): void {
        const newevents: Event[] = grpcToInternalEvent(response);
        this.events = this.events.slice(this.events.length - maxStoredEvents)
            .concat(newevents);
    }

    public detectedEvents(): Event[] {
        return this.events.filter(this.filter);
    }

    public detectedEventTiming(): Map<string, Array<[number, number]>> {
        const overlappableEvents: Map<string, Array<[number, number]>> = new Map();
        for (const ev of this.detectedEvents()) {
            const times: Array<[number, number]> = overlappableEvents.get(ev.tag) || [];
            times.push([ev.start_time, ev.end_time]);
            overlappableEvents.set(ev.tag, times);
        }

        const timings: Map<string, Array<[number, number]>> = new Map();
        for (const tag of overlappableEvents) {
            timings.set(tag[0], mergeOverlappingEvents(overlappableEvents.get(tag[0])));
        }

        return timings;
    }

    public detectedTags(): string[] {
        return [...new Set(this.detectedEvents()
            .map((event: Event): string => event.tag))];
    }

    public service(): string {
        return this.svc;
    }

    public toJSON(): any {
        return {
            events: this.events,
            service: this.svc,
        };
    }

    public useDefaultFilter(): Result {
        this.filter = (ev: Event): boolean => true;

        return this;
    }

    public withFilter(filter: (ev: Event) => boolean): Result {
        this.filter = filter;

        return this;
    }

}

function grpcToInternalEvent(cochlSense: any): Event[] {
    const events: Event[] = cochlSense.getEventsList();

    return events.map((frame: any): Event => {
        const tag: string = frame.getTag();
        const start_time: number = frame.getStarttime();
        const end_time: number = frame.getEndtime();
        const probability: number = frame.getProbability();

        return new Event(tag, start_time, end_time, probability);
    });
}

function mergeOverlappingEvents(times: Array<[number, number]> | undefined): Array<[number, number]> {
    if (times === undefined || times.length === 0) {
        return [];
    }

    const sorted: Array<[number, number]> = times.sort(
        (a: [number, number], b: [number, number]): number =>
            a[0] - b[0],
    );
    const merged: Array<[number, number]> = [times[0]];

    for (const time of sorted) {
        const last: [number, number] = merged[merged.length - 1];
        if (time[0] > last[1]) {
            merged.push(time);
            continue;
        }
        if (time[1] > last[1]) {
            merged[merged.length - 1] = [last[0], time[1]];
        }
    }

    return merged;
}
