import React from 'react'
import PropTypes from 'prop-types'
import icon from './images/wookie.svg'

const Film = (props) => (
  <li className="results__item">
    <h3 className="results__title">{props.item.name}</h3>
    <div
      className="results__bg"
      id={props.item.type}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
    <ul className="results__info">
      <li>
        Designation <span>{props.item.designation}</span>{' '}
      </li>
      <li>
        Classification <span>{props.item.classification}</span>{' '}
      </li>
      <li>
        Language <span>{props.item.language}</span>{' '}
      </li>
    </ul>
  </li>
)

Film.propTypes = {
  item: PropTypes.shape({
    designation: PropTypes.string,
    name: PropTypes.string.isRequired,
    classification: PropTypes.string,
    language: PropTypes.string,
    type: PropTypes.string.isRequired,
  }),
}

export default Film
