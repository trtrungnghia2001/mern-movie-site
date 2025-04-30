import { AiFillLike } from 'react-icons/ai'
import { FaComments, FaHistory, FaUserEdit } from 'react-icons/fa'
import { MdFavorite } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'

export const user_links = [
  {
    title: 'Update Profile',
    path: '/me/update-profile',
    icon: <FaUserEdit />,
  },
  {
    title: 'Change Password',
    path: '/me/change-password',
    icon: <RiLockPasswordFill />,
  },
  {
    title: 'Favorites',
    path: '/me/favorites',
    icon: <MdFavorite />,
  },
  {
    title: 'Likes',
    path: '/me/likes',
    icon: <AiFillLike />,
  },
  {
    title: 'Comments',
    path: '/me/comments',
    icon: <FaComments />,
  },
  {
    title: 'Histories',
    path: '/me/histories',
    icon: <FaHistory />,
  },
]
