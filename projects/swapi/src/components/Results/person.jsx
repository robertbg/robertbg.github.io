import React from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as Icon } from './images/vader.svg'

const Person = (props) => (
  <li className="results__item">
    <h3 className="results__title">{props.item.name}</h3>
    <Icon className="results__bg" id={props.item.type} />
    <ul className="results__info">
      <li>
        Gender <span>{props.item.gender}</span>
      </li>
      <li>
        Height <span>{props.item.height}cm</span>{' '}
      </li>
      <li>
        Weight <span>{props.item.mass}kg</span>{' '}
      </li>
    </ul>
  </li>
)

Person.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    gender: PropTypes.string,
    height: PropTypes.string,
    mass: PropTypes.string,
    type: PropTypes.string,
  }),
}

export default Person
