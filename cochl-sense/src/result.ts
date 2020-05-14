/*tslint:disable variable-name*/

/**
 * Event contains data for one given event :
 * it contains what happen, when, and at which probability
 */
export class Event {
    /** end timestamp of the detected event since the begining of the inference */
    public end_time: number;
    /** probablity for the event to happen. Its values is between 0 and 1 */
    public probability: string;
    /** start timestamp of the detected event since the begining of the inference */
    public start_time: number;
    /** name of the detected event */
    public tag: string;

    public constructor(json: any) {
        this.tag = json.tag;
        this.probability = json.probability;
        this.start_time = json.start_time;
        this.end_time = json.end_time;
    }
}

/**
 * Result is an object which contains data of the
 */
export class Result {
    private events: Event[];
    private filter: (ev: Event) => boolean;
    private readonly svc: string;

    public constructor(response: any) {
        const jsonString: any = response.getOutputs();
        const parsed: any = JSON.parse(jsonString);
        const result: any = parsed.result;
        this.svc = result.task;
        this.events = result.frames.map((frame: any): Event => new Event(frame));
        this.filter = (_: Event): boolean => true;
    }

    public allEvents(): Event[] {
        return this.events;
    }

    public appendNewResult(response: any, maxStoredEvents: number): void {
        const jsonString: any = response.getOutputs();
        const parsed: any = JSON.parse(jsonString);
        const result: any = parsed.result;
        const newevents: Event[] = result.frames.map((frame: any): Event => new Event(frame));
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
