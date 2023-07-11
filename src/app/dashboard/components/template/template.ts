export interface i_Task {
    id: string,
    completed: boolean,
    isSingle: boolean,
    category: string | null,
    taskOf: string,
    color: string,
    title: string,
    description: string | null,
    deadline: Date | null
}

export interface i_Category {
    id: string,
    title: string,
    description: string | null,
    tasks: Array<string>
    color: string
}

export class Task {
    id: string;
    completed: boolean;
    isSingle: boolean;
    category: string | null;
    taskOf: string;
    color: string;
    title: string;
    description: string | null;
    deadline: Date | null;

    constructor (
        id: string,
        completed: boolean,
        isSingle: boolean,
        category: string | null,
        taskOf: string,
        color: string,
        title: string,
        description: string | null,
        deadline: Date | null
    ) {
        this.id = id;
        this.completed = completed;
        this.isSingle = isSingle;
        this.category = category;
        this.taskOf = taskOf;
        this.color = color;
        this.title = title;
        this.description = description;
        this.deadline = deadline
    }

    complete() {
        this.completed = true;
    }

    incomplete() {
        this.completed = false;
    }

    addToCategory(category_id: string) {
        this.category = category_id;
    }

    changeColor(color: string) {
        this.color = color;
    }

    assignUser(user_id: string) {
        this.taskOf = user_id;
    }
}
