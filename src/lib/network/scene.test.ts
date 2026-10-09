import { describe, expect, it } from 'vitest'
import { BRAIN_NODES } from './brain'
import { buildScene, HEMISPHERE } from './scene'

describe('buildScene', () => {
  it('splits the brain into two hemispheres of five nodes', () => {
    const scene = buildScene('wide')
    const brain = scene.nodes.slice(0, BRAIN_NODES.length)
    expect(brain.map((n) => n.hemisphere)).toMatchInlineSnapshot(`
      [
        "human",
        "logic",
        "human",
        "logic",
        "human",
        "logic",
        "human",
        "human",
        "logic",
        "logic",
      ]
    `)
    expect(brain.filter((n) => n.hemisphere === HEMISPHERE.human)).toHaveLength(5)
  })

  it('is deterministic', () => {
    expect(buildScene('wide')).toEqual(buildScene('wide'))
  })

  it('uses fewer nodes on narrow screens', () => {
    expect(buildScene('narrow').nodes.length).toBeLessThan(buildScene('wide').nodes.length)
  })

  it('keeps brain node targets exactly on the logo', () => {
    const scene = buildScene('narrow')
    BRAIN_NODES.forEach((p, i) => expect(scene.nodes[i].brain).toEqual(p))
  })

  it('only links nodes in the same cluster, and every cluster is used', () => {
    const scene = buildScene('wide')
    for (const [a, b] of scene.clusterEdges) {
      expect(scene.nodes[a].cluster).toBe(scene.nodes[b].cluster)
      expect(scene.nodes[a].cluster).toBeGreaterThanOrEqual(0)
    }
    const clusters = new Set(scene.nodes.filter((n) => n.cluster >= 0).map((n) => n.cluster))
    expect(clusters.size).toBe(scene.clusterCount)
  })

  it('puts every brain node in a cluster but leaves some extras out', () => {
    const scene = buildScene('wide')
    expect(scene.nodes.filter((n) => n.isBrain).every((n) => n.cluster >= 0)).toBe(true)
    expect(scene.nodes.some((n) => n.cluster < 0)).toBe(true)
  })

  it('links the scattered network to near neighbours only', () => {
    const scene = buildScene('wide')
    expect(scene.scatterEdges.length).toBeGreaterThan(scene.nodes.length / 2)
    for (const [a, b] of scene.scatterEdges) {
      const p = scene.nodes[a].scatter
      const q = scene.nodes[b].scatter
      expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeLessThanOrEqual(scene.scatterLinkMax)
    }
  })

  it('scatters nodes inside the scatter bounds', () => {
    const { nodes, scatterBounds } = buildScene('wide')
    for (const n of nodes) {
      expect(Math.abs(n.scatter.x)).toBeLessThanOrEqual(scatterBounds.x)
      expect(Math.abs(n.scatter.y)).toBeLessThanOrEqual(scatterBounds.y)
    }
  })
})

describe('cluster edges', () => {
  it('connect every cluster into one piece', () => {
    for (const variant of ['wide', 'narrow'] as const) {
      const scene = buildScene(variant)
      for (let c = 0; c < scene.clusterCount; c++) {
        const members = scene.nodes.flatMap((n, i) => (n.cluster === c ? [i] : []))
        const reached = new Set([members[0]])
        let grew = true
        while (grew) {
          grew = false
          for (const [a, b] of scene.clusterEdges) {
            if (reached.has(a) !== reached.has(b)) {
              reached.add(a)
              reached.add(b)
              grew = true
            }
          }
        }
        expect(members.every((m) => reached.has(m))).toBe(true)
      }
    }
  })
})
