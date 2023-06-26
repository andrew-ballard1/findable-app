import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SearchIcon, CatalogIcon, ItemListIcon, AccountIcon, AccountAnonymousIcon } from '../svgs/Icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Footer = ({ user }) => {
	const navigation = useNavigation()
	const { bottom } = useSafeAreaInsets()
	console.log(user)
	return (
		<View style={[styles.container, {bottom: bottom}]}>
			<TouchableOpacity
				style={styles.link}
				onPress={() => navigation.navigate('findable')}
			>
				<View>
					<SearchIcon />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.link}
				onPress={() => navigation.navigate('Boxes', { isAdding: false, isDeleting: false })}
			>
				<View>
					<CatalogIcon />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.link}
				onPress={() => navigation.navigate('Items', { isAdding: false })}
			>
				<View>
					<ItemListIcon />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.link}
				onPress={() => navigation.navigate('Account')}
			>
				<View>
					{user.isAnonymous ? <AccountAnonymousIcon /> : <AccountIcon />}
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		left: 0,
		right: 0,
		height: 50,
		backgroundColor: '#efefef',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 30,
		paddingBottom: 5,
		paddingTop: 5,
		borderTopWidth: 1,
		borderTopColor: '#dddddd',
		position: 'absolute'
		// Add any additional styling as per your requirements
	},
	link: {
		// Add styles for individual links here
	},
})

export default Footer