import { Avatar, Icon, useTheme } from '@ui-kitten/components'
import React from 'react'
import { ThemedView } from './ThemedView'

const AvatarLarge = (props: {
  avatar_url: string | null | undefined,
}) => {
  const theme = useTheme()

  return (
    <ThemedView style={{
      borderRadius: 100,
      padding: 20,
      alignSelf: "center",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 1,
    }}>
      {props?.avatar_url ?
        <Avatar
          source={{ uri: props?.avatar_url }}
          style={{
            height: 140,
            width: 140,
            margin: -20,
          }} /> :
        <Icon
          fill={theme["color-primary-100"]}
          name="person"
          style={{
            height: 100,
            width: 100,

          }}
        />}
    </ThemedView>
  )
}

export default AvatarLarge