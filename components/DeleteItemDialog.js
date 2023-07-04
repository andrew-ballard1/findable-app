import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'

import colors from '../colors'

const DeleteItemDialog = ({ itemDetails, cancelDelete, deleteItem, isVisible = true }) => {
	const {itemId, label} = itemDetails
	const dialogAnimation = new Animated.Value(0)
	useEffect(() => {
		console.log(dialogAnimation.__getValue())
		dialogAnimation.setValue(0)
	}, [])

	useEffect(() => {
		console.log(itemId)
		if (itemId && dialogAnimation.__getValue() < 0.99) {
			Animated.spring(dialogAnimation, {
				toValue: 1,
				useNativeDriver: true,
			}).start()
		} else if(!itemId && dialogAnimation.__getValue() > 0.01) {
			Animated.spring(dialogAnimation, {
				toValue: 0,
				useNativeDriver: true,
			}).start()
		}
	}, [isVisible])

	const dialogTranslateY = dialogAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [300, -50]
	})

	return (
		<View style={[styles.container]}>
			{isVisible && (
				<Animated.View
					style={[
						styles.dialogContainer,
						{
							transform: [{ translateY: dialogTranslateY }],
						},
					]}
				>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							Do you want to delete {itemId}?
						</Text>
						<View style={styles.buttonContainer}>
							<View style={styles.topRowButtons}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.redButton]}
									onPress={() => deleteItem(itemId)}
								>
									<Text style={styles.buttonText}>Box and Items</Text>
								</TouchableOpacity>
							</View>
							<View>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton, {marginTop: 10}]}
									onPress={() => cancelDelete(itemId)}
								>
									<Text style={styles.buttonText}>Nevermind</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Animated.View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '95%',
		left: '2.5%',
		position: 'absolute',
		bottom: 0
	},
	deleteButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	dialogContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 200,
		width: '100%',
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	dialogContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialogText: {
		fontSize: 22,
		marginBottom: 20,
		textAlign: 'center',
		marginBottom: 20,
		padding: 10
	},
	topRowButtons: {
		flexDirection: 'row',
		height: 40,
		width: '100%',
		justifyContent: 'space-around'
	},
	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		height: 80,
		width: '100%'
	},
	dialogButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	redButton: {
		backgroundColor: colors.error.hex,
		color: colors.error.fontColor
	},
	blueButton: {
		backgroundColor: colors.primary.hex,
		color: colors.primary.fontColor
	},
	greyButton: {
		backgroundColor: colors.lightgrey.hex,
		color: colors.lightgrey.fontColor
	},
})

export default DeleteItemDialog