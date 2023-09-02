import HighPriority from "./elements/highPriority"
import ProdGraphs from "./elements/prodGraphs"
import Upcomming from "./elements/upcomming"

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <div>
            <div><Upcomming></Upcomming></div>
            <div><ProdGraphs></ProdGraphs></div>
            <div><HighPriority></HighPriority></div>
        </div>
    )
}

export default Dashboard
