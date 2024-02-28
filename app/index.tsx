import { Redirect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import React from 'react'

function index() {

    return (
        <Redirect
            href={'/onboard/'}
        />
    )
}

export default index