import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'

import colors from '../colors'
import Loading from './Loading'

const DeleteBoxDialog = ({ boxDetails, cancelDelete, deleteAllItems, deleteBoxOnly, isVisible = true, deleteLoading }) => {
	const {label, boxId} = boxDetails
	const dialogAnimation = new Animated.Value(0)
	useEffect(() => {
		dialogAnimation.setValue(0)
	}, [])

	useEffect(() => {
		console.log(boxId)
		if (boxId && dialogAnimation < 1) {
			Animated.spring(dialogAnimation, {
				toValue: 1,
				useNativeDriver: true,
			}).start()
		} else if(!boxId && dialogAnimation > 0) {
			Animated.spring(dialogAnimation, {
				toValue: 0,
				useNativeDriver: true,
			}).start()
		}
	}, [boxId])

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
							Do you want to delete everything in "{label}" too?
						</Text>
						<View style={styles.buttonContainer}>
							<View style={styles.topRowButtons}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.redButton]}
									onPress={() => deleteAllItems({boxId, label})}
								>
									<Text style={styles.buttonText}>{deleteLoading ? <Loading size={'small'} color={'#ffffff'} /> : 'Box and Items'}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dialogButton, styles.blueButton]}
									onPress={() => deleteBoxOnly({boxId, label})}
								>
									<Text style={styles.buttonText}>Box Only</Text>
								</TouchableOpacity>
							</View>
							<View>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton, {marginTop: 10}]}
									onPress={() => cancelDelete(boxId)}
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
		width: '100%',
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
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		width: '100%',
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

export default DeleteBoxDialog