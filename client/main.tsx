import './main.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Meteor } from 'meteor/meteor'
import { Router } from './Router'

Meteor.startup(() => {
  const container = document.getElementById('react-target')
  const root = createRoot(container!)
  root.render(<Router />)
})
