import { Link } from "./links";

export class Minibio {
    id?: string;
    title: string = "";
    description: string = "";
    image: string = "";
    links: Array<Link> = [];
}