import { StudentType } from '@/lib/types/client';
import { Avatar, Divider, List, ListItem } from '@ui-kitten/components';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react'
import Icon from '@react-native-vector-icons/ionicons';
import useStudentFollowing from '@/lib/hooks/student/useStudentFollowing';

const renderItem = ({ item }: { item: StudentType, index: number }) => {
  const handlePress = () => {
    console.log("student pressed: ", item)
    router.push(`/(app)/student/${item.id}`)
  }

  return (
    <ListItem
      title={`${item?.full_name ?? ""}`}
      description={`${item?.block ?? ""}`}
      onPress={handlePress}
      accessoryLeft={() => {
        if (item?.avatar_url) {
          return <Avatar source={{ uri: item.avatar_url }} size="48" />
        }
        return <Icon name="person-circle-outline" size={48} />
      }}
    />
  )
}

const index = () => {
  const { studentId } = useLocalSearchParams();
  const { data: followings, isFetching } = useStudentFollowing(studentId + "");
  console.log("Followings:\n", followings)

  return (
    <>
      <Stack.Screen
        options={{
          title: "Their Followings",
          headerShadowVisible: false
        }}
      />
      {!isFetching && followings && followings?.length > 0 && (
        <List
          // @ts-ignore
          data={followings}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      )}
    </>
  )
}

export default index