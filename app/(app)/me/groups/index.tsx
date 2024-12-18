import useSelfGroups from '@/lib/hooks/me/useSelfGroups';
import { GroupType } from '@/lib/types/client';
import { Avatar, Divider, List, ListItem } from '@ui-kitten/components';
import Icon from '@react-native-vector-icons/ionicons';
import { Stack } from 'expo-router';
import React from 'react'

const renderItem = ({ item }: { item: GroupType, index: number }) => (
  <ListItem
    title={`${item?.name ?? ""}`}
    description={`${item?.approx_members_count ?? ""} Members`}
    accessoryLeft={() => {
      if (item?.avatar_url) {
        return <Avatar source={{ uri: item.avatar_url }} size="48" />
      }
      return <Icon name="people-circle-outline" size={48} />
    }}
  />
)

const index = () => {
  const { data: groups, isFetching } = useSelfGroups();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Groups",
          headerShadowVisible: false
        }}
      />
      {!isFetching && groups && groups?.length > 0 && (
        <List
          // @ts-ignore
          data={groups}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      )}
    </>
  )
}

export default index