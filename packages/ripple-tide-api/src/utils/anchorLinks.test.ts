import { expect, describe } from '@jest/globals'
import { addAnchorLinksToHTML, getAnchorLinksFromHTML } from './anchorLinks.js'

const html = `<h1>First Heading</h1>
<h2>Second Heading</h2>
<h3>Third Heading</h3>
<h4>Fourth Heading</h4>
<h5>Fifth Heading</h5>
<h6>First Heading</h6>
<p>Paragraph <span>With Span</span></p>
<ul><li>List item</li></ul>
<ol><li>List item</li></ol>
<table><tbody><tr><td>Table</td></tr></tbody></table>
<hr />
<h2></h2>
<h2> </h2>
<h2>

</h2>
<h2>&nbsp;</h2>
<h2>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</h2>
<h2>Special Character &amp; &lt; &gt; Heading</h2>
<h2><span>Heading 2 with inner SPAN</span></h2>
<!-- comment -->
<h2><a href="/">Heading 2 with inner LINK</a></h2>
<h2>camelCaseHeading</h2>
<h3>This is h3 under camelCaseHeading h2</h3>`

describe('anchor link utilities', () => {
  test('should add id to h2 and h3 elements', async () => {
    expect(addAnchorLinksToHTML(html)).toEqual(`<h1>First Heading</h1>
<h2 id="second-heading">Second Heading</h2>
<h3 id="third-heading">Third Heading</h3>
<h4>Fourth Heading</h4>
<h5>Fifth Heading</h5>
<h6>First Heading</h6>
<p>Paragraph <span>With Span</span></p>
<ul><li>List item</li></ul>
<ol><li>List item</li></ol>
<table><tbody><tr><td>Table</td></tr></tbody></table>
<hr />
<h2></h2>
<h2> </h2>
<h2>

</h2>
<h2>&nbsp;</h2>
<h2>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</h2>
<h2 id="special-character-heading">Special Character &amp; &lt; &gt; Heading</h2>
<h2 id="heading-2-with-inner-span"><span>Heading 2 with inner SPAN</span></h2>
<!-- comment -->
<h2 id="heading-2-with-inner-link"><a href="/">Heading 2 with inner LINK</a></h2>
<h2 id="camelcaseheading">camelCaseHeading</h2>
<h3 id="this-is-h3-under-camelcaseheading-h2">This is h3 under camelCaseHeading h2</h3>`)
  })

  test('should get list of links for h2 and h3 with text', async () => {
    expect(getAnchorLinksFromHTML(html, true)).toEqual([
      { text: 'Second Heading', id: 'second-heading', type: 'h2' },
      { text: 'Third Heading', id: 'third-heading', type: 'h3' },
      {
        text: 'Special Character & < > Heading',
        id: 'special-character-heading',
        type: 'h2'
      },
      {
        text: 'Heading 2 with inner SPAN',
        id: 'heading-2-with-inner-span',
        type: 'h2'
      },
      {
        text: 'Heading 2 with inner LINK',
        id: 'heading-2-with-inner-link',
        type: 'h2'
      },
      { text: 'camelCaseHeading', id: 'camelcaseheading', type: 'h2' },
      {
        text: 'This is h3 under camelCaseHeading h2',
        id: 'this-is-h3-under-camelcaseheading-h2',
        type: 'h3'
      }
    ])
  })

  test('should get the all the list of h2 links', async () => {
    expect(getAnchorLinksFromHTML(html)).toEqual([
      { text: 'Second Heading', id: 'second-heading', type: 'h2' },
      {
        text: 'Special Character & < > Heading',
        id: 'special-character-heading',
        type: 'h2'
      },
      {
        text: 'Heading 2 with inner SPAN',
        id: 'heading-2-with-inner-span',
        type: 'h2'
      },
      {
        text: 'Heading 2 with inner LINK',
        id: 'heading-2-with-inner-link',
        type: 'h2'
      },
      { text: 'camelCaseHeading', id: 'camelcaseheading', type: 'h2' }
    ])
  })
})
