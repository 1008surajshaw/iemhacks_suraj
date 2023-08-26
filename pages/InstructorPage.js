import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

export const InstructorPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
  return (
    <div>InstructorPage</div>
  )
}
