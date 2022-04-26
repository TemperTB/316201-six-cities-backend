import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.black.bgCyan.bold('Программа для подготовки данных для REST API сервера.')}
        ${chalk.black.bgWhite.bold('Пример:')}
            main.js ${chalk.cyan('--<command>')} ${chalk.magenta('[--arguments]')}
        ${chalk.black.bgWhite.bold('Команды:')}
            ${chalk.cyan('--version')}:                    # выводит номер версии
            ${chalk.cyan('--help')}                        # печатает этот текст
            ${chalk.cyan('--import')} ${chalk.magenta('<path>')}:              # импортирует данные из TSV
            ${chalk.cyan('--generator')} ${chalk.magenta('<n> <path> <url>')}: # генерирует произвольное количество тестовых данных
        `);
  }
}
