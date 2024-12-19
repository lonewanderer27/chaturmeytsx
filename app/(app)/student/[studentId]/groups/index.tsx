import { GroupType } from '@/lib/types/client';
import { Avatar, Divider, List, ListItem } from '@ui-kitten/components';
import Icon from '@react-native-vector-icons/ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react'
import useStudentGroups from '@/lib/hooks/student/useStudentGroups';
import { ThemedView } from '@/lib/components/ThemedView';

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
  const { studentId } = useLocalSearchParams();
  const { data: groups, isFetching } = useStudentGroups(studentId + "");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Their Groups",
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