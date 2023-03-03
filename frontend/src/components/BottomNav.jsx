import Home from '@mui/icons-material/Home';
import Dashboard from '@mui/icons-material/Dashboard';
import Pets from '@mui/icons-material/Pets';
import Settings from '@mui/icons-material/Settings';

const BottomNav = () => {

    const icons = [
        {
            iconName: 'Home',
            icon: <Home/>
        },
        {
            iconName: 'Home',
            icon: <Dashboard/>
        },
        {
            iconName: 'Home',
            icon: <Pets/>
        },
        {
            iconName: 'Home',
            icon: <Settings/>
        },
    ]

    const Icon = ({icon, iconName}) => {
        return (
            <>
                <i className={'text-navyLightest text-sm'}>{icon}</i>
                <span className={'text-'}>{iconName}</span>
            </>
        )
    }

    return (
        <div>
            {
                icons.map((icon) => {
                    return <Icon {...icon}/>
                })
            }
        </div>
    )
}

export default BottomNav