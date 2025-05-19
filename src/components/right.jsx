import React from 'react'
import RightTop from "./rightTop"
import  RightBottom from"./rightBottom"
import Music from"./Music"
import "../css/right.css"
function right() {
  return (
    <div className='right'>
      <RightTop/>
      <RightBottom/>
      <Music/>
    </div>
  )
}

export default right