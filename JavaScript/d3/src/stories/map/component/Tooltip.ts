import * as d3 from 'd3';

export function addTooltip(svgSelect: any, elementSelect: any = null) {
  const mouseOffset = [10,10]

  const style = `
    .svg-tooltip {
      background-color: rgba(255, 255, 255, 0.7);
      position: absolute;
      transform: translate(178px, 410.19px);
      border-style: solid;
      border-color: black;
      border-width: 1px;
      border-radius: 2px;
      font-family: sans-serif;
      font-size: 12px;
      padding: 8px;
      visibility: hidden;
      max-width: 180px;
  }`

  svgSelect.append("style").text(style)

  const foreignObject = svgSelect.append("foreignObject")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("pointer-events", "none")

  const tooltip = foreignObject.append("xhtml:div")
    .attr("class", "svg-tooltip")

  function show(text: any, x: any, y: any) {
    let posX = x + mouseOffset[0]
    let posY = y + mouseOffset[1]

    tooltip.html(text)
    tooltip.style("visibility", "visible")

    const svgBox = svgSelect.node().getBBox()
    const tooltipBox = tooltip.node().getBoundingClientRect()

    if (posX > svgBox.width - tooltipBox.width) {
      posX = x - tooltipBox.width - mouseOffset[0]
    }
    if (posY > svgBox.height - tooltipBox.height) {
      posY = y - tooltipBox.height - mouseOffset[1]
    }

    tooltip.style("transform", `translate(${posX}px,${posY}px)`)
  }

  function hide() {
    tooltip.style("visibility", "hidden")
  }

  if (elementSelect != null) {
    elementSelect.on("mouseover", (e: any) => {
      const title = d3.select(e.target).select("title").text()
      const bbox = e.target.getBBox()
      const centroid = [bbox.x + bbox.width/2, bbox.y+bbox.height/2]
      show(title, centroid[0], centroid[1])
    })
    .on("mouseleave", () => hide())
  }
  
  return {show, hide}
}