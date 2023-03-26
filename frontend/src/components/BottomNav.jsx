import {MdHomeFilled} from 'react-icons/md'
import {MdDashboard} from 'react-icons/md'
import {MdPets} from 'react-icons/md'
import {MdSettings} from 'react-icons/md'
import {Link} from 'react-router-dom'

// TODO: Refine some aspects of this. Icon size. Font size. Font weight. Spacing, both horizontal and vertical. Change colour based on selected route.

const BottomNav = () => {

    const icons = [
        {
            iconName: 'Home',
            icon: <MdHomeFilled/>
        },
        {
            iconName: 'Captures',
            icon: <MdDashboard/>
        },
        {
            iconName: 'Pets',
            icon: <MdPets/>
        },
        {
            iconName: 'Settings',
            icon: <MdSettings/>
        },
    ]

    const Icon = ({icon, iconName}) => {
        return (
            <div className={'flex flex-col items-center'}>
                <i className={'text-navyLightest text-2xl'}>{icon}</i>
                <span className={'text-navyLightest'}>{iconName}</span>
            </div>
        )
    }

    return (
        <div className={'h-[65px] fixed left-0 bottom-0 w-screen flex justify-around mt-2 font-light bg-white py-2'}>
            {
                icons.map((icon) => {
                    return <Link to={icon.iconName === 'Home' && '/' || icon.iconName.toLowerCase()}><Icon {...icon}/></Link>
                })
            }
        </div>
    )
}

export default BottomNav