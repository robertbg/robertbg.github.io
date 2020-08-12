import React from 'react'
import PropTypes from 'prop-types'
import './search.scss'
import { ReactComponent as Icon } from './search.svg'

const Search = (props) => {
  const { value, onChange } = props

  return (
    <div className="search">
      <div className="search__title">Search by</div>
      <div className="search__subtitle">
        Films, Characters, Species, Starships & Planets
      </div>
      <div className="search__input">
        <Icon className="search__icon" />
        <input
          type="text"
          placeholder="Enter a search term"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          autoFocus
        />
      </div>
    </div>
  )
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
}

export default Search
