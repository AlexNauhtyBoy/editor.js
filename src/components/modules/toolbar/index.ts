import Module from '../../__module';
import $ from '../../dom';
import DeleteTune from '../../block-tunes/block-tune-delete';

/**
 *
 * «Toolbar» is the node that moves up/down over current block
 *
 *  ______________________________________ Toolbar ____________________________________________
 * |                                                                                           |
 * |  ..................... Content ....................   ......... Block Actions ..........  |
 * |  .                                                .   .                                .  |
 * |  .                                                .   .        [Open Settings]         .  |
 * |  .  [Plus Button]  [Toolbox: {Tool1}, {Tool2}]    .   .                                .  |
 * |  .                                                .   .        [Settings Panel]        .  |
 * |  ..................................................   ..................................  |
 * |                                                                                           |
 * |___________________________________________________________________________________________|
 *
 *
 * Toolbox — its an Element contains tools buttons. Can be shown by Plus Button.
 *
 *  _______________ Toolbox _______________
 * |                                       |
 * | [Header] [Image] [List] [Quote] ...   |
 * |_______________________________________|
 *
 *
 * Settings Panel — is an Element with block settings:
 *
 *   ____ Settings Panel ____
 *  | ...................... |
 *  | .   Tool Settings    . |
 *  | ...................... |
 *  | .  Default Settings  . |
 *  | ...................... |
 *  |________________________|
 *
 *
 * @class
 * @classdesc Toolbar module
 *
 * @typedef {Toolbar} Toolbar
 * @property {Object} nodes
 * @property {Element} nodes.wrapper        - Toolbar main element
 * @property {Element} nodes.content        - Zone with Plus button and toolbox.
 * @property {Element} nodes.actions        - Zone with Block Settings and Remove Button
 * @property {Element} nodes.blockActionsButtons   - Zone with Block Buttons: [Settings]
 * @property {Element} nodes.plusButton     - Button that opens or closes Toolbox
 * @property {Element} nodes.toolbox        - Container for tools
 * @property {Element} nodes.settingsToggler - open/close Settings Panel button
 * @property {Element} nodes.settings          - Settings Panel
 * @property {Element} nodes.pluginSettings    - Plugin Settings section of Settings Panel
 * @property {Element} nodes.defaultSettings   - Default Settings section of Settings Panel
 */
export default class Toolbar extends Module {
  /**
   * HTML Elements used for Toolbar UI
   */
  public nodes: {[key: string]: HTMLElement} = {
    wrapper : null,
    content : null,
    actions : null,

    // Content Zone
    plusButton : null,

    // Actions Zone
    blockActionsButtons: null,
    settingsToggler : null,
  };

  /**
   * CSS styles
   * @return {Object}
   */
  public get CSS() {
    return {
      toolbar: 'ce-toolbar',
      content: 'ce-toolbar__content',
      actions: 'ce-toolbar__actions',
      actionsOpened: 'ce-toolbar__actions--opened',

      toolbarOpened: 'ce-toolbar--opened',

      // Content Zone
      plusButton: 'ce-toolbar__plus',
      plusButtonHidden: 'ce-toolbar__plus--hidden',

      // Actions Zone
      blockActionsButtons: 'ce-toolbar__actions-buttons',
      settingsToggler: 'ce-toolbar__settings-btn',
    };
  }

  /**
   * Makes toolbar
   */
  public make(): void {
    this.nodes.wrapper = $.make('div', this.CSS.toolbar);

    /**
     * Make Content Zone and Actions Zone
     */
    ['content',  'actions'].forEach( (el) => {
      this.nodes[el] = $.make('div', this.CSS[el]);
      $.append(this.nodes.wrapper, this.nodes[el]);
    });

    /**
     * Fill Content Zone:
     *  - Plus Button
     *  - Toolbox
     */
    this.nodes.plusButton = $.make('div', this.CSS.plusButton);

    /**
     * Add events to show/hide tooltip for plus button
     */
    this.Editor.Listeners.on(this.nodes.plusButton, 'mouseenter', () => {
      const tooltip = this.Editor.Toolbox.nodes.tooltip;
      const fragment = document.createDocumentFragment();

      fragment.appendChild(document.createTextNode('Add'));
      fragment.appendChild($.make('div', this.Editor.Toolbox.CSS.tooltipShortcut, {
        textContent: '⇥ Tab',
      }));

      tooltip.style.left = '-17px';

      tooltip.innerHTML = '';
      tooltip.appendChild(fragment);
      tooltip.classList.add(this.Editor.Toolbox.CSS.tooltipShown);
    });

    this.Editor.Listeners.on(this.nodes.plusButton, 'mouseleave', () => {
      this.Editor.Toolbox.hideTooltip();
    });

    $.append(this.nodes.plusButton, $.svg('plus', 14, 14));
    $.append(this.nodes.content, this.nodes.plusButton);
    this.Editor.Listeners.on(this.nodes.plusButton, 'click', () => this.plusButtonClicked(), false);

    /**
     * Make a Toolbox
     */
    this.Editor.Toolbox.make();

    /**
     * Fill Actions Zone:
     *  - Settings Toggler
     *  - Remove Block Button
     *  - Settings Panel
     */
    this.nodes.blockActionsButtons = $.make('div', this.CSS.blockActionsButtons);
    this.nodes.settingsToggler  = $.make('span', this.CSS.settingsToggler);
    // tslint:disable-next-line:max-line-length
    const settingsIcon = $.svgFromString('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" [attr.fill]="color"><path d="M12.00025,11.29325 L15.18225,8.11125 L15.88925,8.81825 L12.70725,12.00025 L15.88925,15.18225 L15.18225,15.88925 L12.00025,12.70725 L8.81825,15.89025 L8.11125,15.18325 L11.29325,12.00025 L8.11025,8.81825 L8.81725,8.11125 L12.00025,11.29325 Z M20.48525,20.48525 C15.79925,25.17225 8.20125,25.17225 3.51525,20.48525 C-1.17175,15.79925 -1.17175,8.20125 3.51525,3.51525 C8.20125,-1.17175 15.79925,-1.17175 20.48525,3.51525 C25.17225,8.20125 25.17225,15.79925 20.48525,20.48525 Z M19.77825,19.77825 C24.07425,15.48225 24.07425,8.51825 19.77825,4.22225 C15.48225,-0.07375 8.51825,-0.07375 4.22225,4.22225 C-0.07375,8.51825 -0.07375,15.48225 4.22225,19.77825 C8.51825,24.07425 15.48225,24.07425 19.77825,19.77825 Z"/></svg>\n');

    $.append(this.nodes.settingsToggler, settingsIcon);
    $.append(this.nodes.blockActionsButtons, this.nodes.settingsToggler);
    $.append(this.nodes.actions, this.nodes.blockActionsButtons);

    /**
     * Make and append Settings Panel
     */
    this.Editor.BlockSettings.make();
    $.append(this.nodes.actions, this.Editor.BlockSettings.nodes.wrapper);

    /**
     * Append toolbar to the Editor
     */
    $.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);

    /**
     * Bind events on the Toolbar elements
     */
    this.bindEvents();
  }

  /**
   * Move Toolbar to the Current Block
   * @param {Boolean} forceClose - force close Toolbar Settings and Toolbar
   */
  public move(forceClose: boolean = true): void {
    if (forceClose) {
      /** Close Toolbox when we move toolbar */
      this.Editor.Toolbox.close();
      this.Editor.BlockSettings.close();
    }

    const currentBlock = this.Editor.BlockManager.currentHoveredBlock.holder;

    /**
     * If no one Block selected as a Current
     */
    if (!currentBlock) {
      return;
    }

    const { isMobile } = this.Editor.UI;
    const blockHeight = currentBlock.offsetHeight;
    let toolbarY = currentBlock.offsetTop;

    /**
     * 1) On desktop — Toolbar at the top of Block, Plus/Toolbox moved the center of Block
     * 2) On mobile — Toolbar at the bottom of Block
     */
    if (!isMobile) {
      const contentOffset = Math.floor(blockHeight / 2);

      this.nodes.plusButton.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
      this.Editor.Toolbox.nodes.toolbox.style.transform = `translate3d(0, calc(${contentOffset}px - 50%), 0)`;
    } else {
      toolbarY += blockHeight;
    }

    /**
     * Move Toolbar to the Top coordinate of Block
     */
    this.nodes.wrapper.style.transform = `translate3D(0, ${Math.floor(toolbarY)}px, 0)`;
  }

  /**
   * Open Toolbar with Plus Button and Actions
   * @param {boolean} withBlockActions - by default, Toolbar opens with Block Actions.
   *                                     This flag allows to open Toolbar without Actions.
   * @param {boolean} needToCloseToolbox - by default, Toolbar will be moved with opening
   *                                      (by click on Block, or by enter)
   *                                      with closing Toolbox and Block Settings
   *                                      This flag allows to open Toolbar with Toolbox
   */
  public open(withBlockActions: boolean = true, needToCloseToolbox: boolean = true): void {
    setTimeout(() => {
      this.move(needToCloseToolbox);
      this.nodes.wrapper.classList.add(this.CSS.toolbarOpened);

      if (withBlockActions) {
        this.blockActions.show();
      } else {
        this.blockActions.hide();
      }
    }, 50);
  }

  /**
   * returns toolbar opened state
   * @return {Boolean}
   */
  public get opened(): boolean {
    return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened);
  }

  /**
   * Close the Toolbar
   */
  public close(): void {
    this.nodes.wrapper.classList.remove(this.CSS.toolbarOpened);

    /** Close components */
    this.blockActions.hide();
    this.Editor.Toolbox.close();
    this.Editor.BlockSettings.close();
  }

  /**
   * Plus Button public methods
   * @return {{hide: function(): void, show: function(): void}}
   */
  public get plusButton(): {hide: () => void, show: () => void} {
    return {
      hide: () => this.nodes.plusButton.classList.add(this.CSS.plusButtonHidden),
      show: () => {
        if (this.Editor.Toolbox.isEmpty) {
          return;
        }
        this.nodes.plusButton.classList.remove(this.CSS.plusButtonHidden);
      },
    };
  }

  /**
   * Block actions appearance manipulations
   * @return {{hide: function(): void, show: function(): void}}
   */
  private get blockActions(): {hide: () => void, show: () => void} {
    return {
      hide: () => {
        this.nodes.actions.classList.remove(this.CSS.actionsOpened);
      },
      show : () => {
        this.nodes.actions.classList.add(this.CSS.actionsOpened);
      },
    };
  }

  /**
   * Handler for Plus Button
   * @param {MouseEvent} event
   */
  private plusButtonClicked(): void {
    this.Editor.Toolbox.toggle();
  }

  /**
   * Bind events on the Toolbar Elements:
   * - Block Settings
   */
  private bindEvents(): void {
    /**
     * Settings toggler
     */
    this.Editor.Listeners.on(this.nodes.settingsToggler, 'click', () => this.settingsTogglerClicked());
  }

  /**
   * Clicks on the Block Settings toggler
   */
  private settingsTogglerClicked(): void {
    const currentBlock = this.Editor.BlockManager.currentBlockIndex;
    this.Editor.BlocksAPI.delete(currentBlock);
  }
}
