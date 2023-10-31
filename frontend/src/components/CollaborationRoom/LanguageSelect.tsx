import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'
import '../../styles/Room.css'

const options = ['Javascript', 'Java', 'Python']

const LanguageSelect = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selection, setSelection] = useState('')

    return (
        <div className='dropdown-wrapper'>
            <button className={`toggle-button`} onClick={() => setIsOpen(!isOpen)}>
                {!selection ? 'Javascript' : selection}
                <KeyboardArrowDownIcon />
            </button>
            <ul id='custom-listbox' className={`listbox ${isOpen ? 'isOpen' : ''}`}>
                {options.map((option) => (
                    <li
                        role='option'
                        onClick={() => {
                            setSelection(option)
                            setIsOpen(false)
                        }}
                        key={option}
                        className={'list-option'}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageSelect
