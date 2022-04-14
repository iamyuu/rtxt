// @ts-ignore -- allowSyntheticDefaultImports
import React, { Fragment, cloneElement } from 'react'
import type { ReactElement } from 'react'

const tagRe = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/
const nlRe = /(?:\r\n|\r|\n)/g

function getElements(parts: Array<string | undefined>) {
	if (!parts.length) return []

	const part = parts.slice(0, 4)

	return [[part[0] || part[2], part[1] || '', part[3]]].concat(getElements(parts.slice(4, parts.length)))
}

export default function formatElements(text: string, components: ReactElement[] | Record<string, ReactElement> = []) {
	const parts = text.replace(nlRe, '').split(tagRe)

	if (parts.length === 1) {
		return text
	}

	const tree = []

	const before = parts.shift()
	if (before) {
		tree.push(before)
	}

	getElements(parts).forEach((part, index) => {
		const element =
			// @ts-ignore
			components[part[0] as string] || <Fragment />

		tree.push(
			cloneElement(
				element,
				{ key: index },

				// format children for pair tags
				// unpaired tags might have children if it's a component passed as a variable
				part[1] ? formatElements(part[1], components) : element.props.children,
			),
		)

		if (part[2]) tree.push(part[2])
	})

	return tree
}
