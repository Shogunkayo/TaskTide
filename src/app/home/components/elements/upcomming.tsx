import { RootState } from "@/app/redux/store"
import { useSelector } from "react-redux"

type Props = {}

const Upcomming = (props: Props) => {
    const tasks = useSelector((state: RootState) => state.task.tasks)
    const categories = useSelector((state: RootState) => state.task.categories)

    const tasksDone = 0;
    const tasksRemaining = 0;
    const upcomming = [];

    return (
        <div>
            <div>
                <h2>Tasks Due</h2>
            </div>
        </div>
    )
}

export default Upcomming
