/**
 * @file Provides a `Style` object for form styles
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
const Style = {

  /**** styles ****/
  // in general the key is bound to a component or html element
  // all class names are tachyons unless otherwise noted

    //*** forms ***//

    // label/input/error/help wrapper
    "inputWrapper": "mt3 pt2 bt b--light-silver",

    // form element
    "form": "pa0 black-80 tl",

    // form input messages
    "message": "f6 lh-copy db mb2",

    // default input element style
    "inputDefault": "input-reset ba b--black-20 br2 pa2 mb2 db w-90",

    // error input element style
    "inputError": "input-reset ba b--red br2 pa2 mb2 db w-100",

    // success input element style
    "inputSuccess": "input-reset ba b--dark-green br2 pa2 mb2 db w-100",

    // warning input element style
    "inputWarning": "input-reset ba b--orange br2 pa2 mb2 db w-100",

    // label element
    "label": "f5 b db mb3",

    // input description - here usually a html `small` element
    "inputHelpText": "f6 lh-copy black-40 db mb2 tr",

    // default button element style
    //"buttonDefault": "f6 link dim br3 ph3 pv2 mb2 fw8 ba b--dark-gray-black near-black bg-moon-gray",
    "buttonDefault": "pointer br2 ba b--dark-blue bg-blue white pa2 ml1 mv1 bg-animate hover-bg-dark-blue border-box",
}
export default Style
