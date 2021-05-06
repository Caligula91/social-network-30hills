export class User {
    constructor(
        public id: number, 
        public firstName: string, 
        public surname: string | null, 
        public age: number | null, 
        public gender: string,
        public friends: Set<number>) {}
}