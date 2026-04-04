import React from 'react'
import { createSelector } from '@reduxjs/toolkit'

const selectAuth = (state) => state.auth

export const selectUser = createSelector(selectAuth, (auth) => auth.user)
export const selectIsAuthenticated = createSelector(selectAuth, (auth) => !!auth.user)
export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.loading)
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error)
export const selectIsAdmin = createSelector(selectUser, (user) => user?.role === 'admin')
