'use client'

import { RootState } from "@/app/redux/store"
import { useSelector } from "react-redux"

type Props = {}

const Tasklist = (props: Props) => {
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)

    return (
        <div>
            {
                Object.keys(categories).map((category) => (
                    <div key={category}>
                        {categories[category].title}
                    </div>
                ))
            }
        </div>
    )
}

export default Tasklist
