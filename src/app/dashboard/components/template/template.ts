interface Task {
    id: string,
    completed: boolean,
    isSingle: boolean,
    category?: string,
    taskOf: string,
    color: string,
    title: string,
    description?: string,
    deadline: Date
}

interface Category {
    id: string,
    title: string,
    description?: string,
    tasks: Array<string>
    color: string
}
