import React, { useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'

const VerticalCarousel = ({ messages }) => {
	const [currentMessageIndex, setCurrentMessageIndex] = useState(Math.floor(Math.random() * messages.length))
	const [opacity, setOpacity] = useState(new Animated.Value(1))
	const [inverseOpacity, setInversOpacity] = useState(new Animated.Value(0))
	const [translationY, setTranslationY] = useState(new Animated.Value(0))
	const [lowerTranslationY, setLowerTranslationY] = useState(new Animated.Value(20))

	useEffect(() => {
		const timer = setInterval(() => {
			animateTransition()
		}, 60000)

		return () => {
			clearInterval(timer)
		}
	}, [])

	const animateTransition = () => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(inverseOpacity, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(translationY, {
				toValue: -60,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(lowerTranslationY, {
				toValue: -40,
				duration: 1000,
				useNativeDriver: true,
			}),
		]).start(() => {
			setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)

			setTimeout( () => {
				translationY.setValue(0)
				lowerTranslationY.setValue(20)

				opacity.setValue(1)
				inverseOpacity.setValue(0)
	
			}, 1)

			// Reset animation values for next message
		})
	}

	return (
		<View style={styles.container}>
			<Animated.Text
				style={[
					styles.message,
					{
						opacity,
						transform: [{ translateY: translationY }],
					},
				]}
			>
				{messages[currentMessageIndex]}
			</Animated.Text>
			<Animated.Text
				style={[
					styles.message,
					{
						opacity: inverseOpacity,
						transform: [{ translateY: lowerTranslationY }]
					}
				]}
			>
				{currentMessageIndex < messages.length - 1 ? messages[currentMessageIndex + 1] : messages[0]}
			</Animated.Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 0,
		minHeight: 0,
		// wrap: 'nowrap'
	},
	message: {
		flex: 1,
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 10
		// height: 40,
		// minHeight: 40
	},
})

export default VerticalCarousel