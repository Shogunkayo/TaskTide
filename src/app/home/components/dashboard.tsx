import HighPriority from "./elements/highPriority"
import ProdGraphs from "./elements/prodGraphs"
import Upcomming from "./elements/upcomming"
import styles from './dashboard.module.scss'

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <div className={styles['dashboard-container']}>
            <div className={styles['top']}>
                <Upcomming></Upcomming>
            </div>
            <div className={styles['bottom']}>
                <ProdGraphs></ProdGraphs>
                <HighPriority></HighPriority>
            </div>
        </div>
    )
}

export default Dashboard
