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
            iconName: 'Dashboard',
            icon: <Dashboard/>
        },
        {
            iconName: 'Pets',
            icon: <Pets/>
        },
        {
            iconName: 'Settings',
            icon: <Settings/>
        },
    ]

    const Icon = ({icon, iconName}) => {
        return (
            <div className={'flex flex-col items-center'}>
                <i className={'text-navyLightest text-sm'}>{icon}</i>
                <span className={'text-navyLightest'}>{iconName}</span>
            </div>
        )
    }

    return (
        <div className={'absolute left-0 bottom-0 w-screen flex justify-around my-2 font-light'}>
            {
                icons.map((icon) => {
                    return <Icon {...icon}/>
                })
            }
        </div>
    )
}

export default BottomNav