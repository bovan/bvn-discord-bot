export class Cron {
    public jobs: Array<number> = [];

    constructor() {
    }

    addJob(job: Function) {
        this.jobs.push(0);
    }
}