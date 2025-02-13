import Module from '../../__module';
import {Caret} from '../../../../types/api';

/**
 * @class CaretAPI
 * provides with methods to work with caret
 */
export default class CaretAPI extends Module {
  /**
   * Available methods
   * @return {Caret}
   */
  get methods(): Caret {
    return {
      setToFirstBlock: this.setToFirstBlock,
      setToLastBlock: this.setToLastBlock,
      setToPreviousBlock: this.setToPreviousBlock,
      setToNextBlock: this.setToNextBlock,
      setToBlock: this.setToBlock,
      focus: this.focus,
    };
  }

  /**
   * Sets caret to the first Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  private setToFirstBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): boolean => {
    if (!this.Editor.BlockManager.firstBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(this.Editor.BlockManager.firstBlock, position, offset);
    return true;
  }

  /**
   * Sets caret to the last Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  private setToLastBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): boolean => {
    if (!this.Editor.BlockManager.lastBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(this.Editor.BlockManager.lastBlock, position, offset);
    return true;
  }

  /**
   * Sets caret to the previous Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  private setToPreviousBlock = (
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset: number = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.previousBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(this.Editor.BlockManager.previousBlock, position, offset);
    return true;
  }

  /**
   * Sets caret to the next Block
   *
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  private setToNextBlock = (position: string = this.Editor.Caret.positions.DEFAULT, offset: number = 0): boolean => {
    if (!this.Editor.BlockManager.nextBlock) {
      return false;
    }

    this.Editor.Caret.setToBlock(this.Editor.BlockManager.nextBlock, position, offset);
    return true;
  }

  /**
   * Sets caret to the Block by passed index
   *
   * @param {number} index - index of Block where to set caret
   * @param {string} position - position where to set caret
   * @param {number} offset - caret offset
   *
   * @return {boolean}
   */
  private setToBlock = (
    index: number,
    position: string = this.Editor.Caret.positions.DEFAULT,
    offset: number = 0,
  ): boolean => {
    if (!this.Editor.BlockManager.blocks[index]) {
      return false;
    }

    this.Editor.Caret.setToBlock(this.Editor.BlockManager.blocks[index], position, offset);
    return true;
  }

  /**
   * Sets caret to the Editor
   *
   * @param {boolean} atEnd - if true, set Caret to the end of the Editor
   *
   * @return {boolean}
   */
  private focus = (atEnd: boolean = false) => {
    if (atEnd) {
      console.log(this.Editor.BlockManager.currentBlock);
      return this.setToLastBlock(this.Editor.Caret.positions.END);
    }

    return this.setToFirstBlock(this.Editor.Caret.positions.START);
  }
}
